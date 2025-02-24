import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use((req: Request, res: Response, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    const jsonString = JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    res.setHeader("Content-Type", "application/json");
    return res.send(jsonString);
  };
  next();
});

function handleError(
  res: Response,
  error: unknown,
  defaultMessage: string
): void {
  console.error(error);
  if (error instanceof Error) {
    res.status(500).json({ error: defaultMessage, details: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred." });
  }
}

app.get("/", (req: Request, res: Response): void => {
  res.send("API is running!");
});

app.post("/users", async (req: Request, res: Response): Promise<void> => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email already exists." });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { first_name, last_name, email, password_hash },
    });

    res.status(201).json(newUser);
  } catch (error: unknown) {
    handleError(res, error, "Failed to create user.");
  }
});

app.get("/users", async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error: unknown) {
      handleError(res, error, "Failed to fetch users.");
    }
});

app.put("/users/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = BigInt(req.params.id);
      const { first_name, last_name, email, password } = req.body;
  
      const updateData: any = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (email) updateData.email = email;
      if (password) {
        updateData.password_hash = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
  
      res.json(updatedUser);
    } catch (error: unknown) {
      handleError(res, error, "Failed to update user.");
    }
});
  
app.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = BigInt(req.params.id);
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });
      res.json(deletedUser);
    } catch (error: unknown) {
      handleError(res, error, "Failed to delete user.");
    }
});  
  

app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (error: unknown) {
    handleError(res, error, "Failed to login.");
  }
});

const authMiddleware = async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token not provided!" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
    });
    if (!user) {
      res.status(401).json({ message: "User not found!" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

app.post(
  "/subscribe",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { userId, plan } = req.body;

    try {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (plan === "monthly" ? 1 : 12));

      const subscription = await prisma.userSubscription.create({
        data: {
          user_id: BigInt(userId),
          plan_id: plan === "monthly" ? 1 : 2,
          start_date: new Date(),
          end_date: expiresAt,
          status: "ACTIVE",
        },
      });

      res.status(201).json(subscription);
    } catch (error: unknown) {
      handleError(res, error, "Failed to create subscription.");
    }
  }
);

app.post(
  "/videos/upload",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { title, description, url, isShort, isPremium } = req.body;

    if (!req.user?.role || req.user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied!" });
      return;
    }

    try {
      const video = await prisma.content.create({
        data: {
          title,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
          description,
          type: isShort ? "SHORT" : "EVENT_VIDEO",
          video_url: url,
          is_premium: isPremium,
          status: "PUBLISHED",
          published_at: new Date(),
        },
      });
      res.status(201).json(video);
    } catch (error: unknown) {
      handleError(res, error, "Failed to upload video.");
    }
  }
);

app.get("/videos", async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  try {
    const user = userId
      ? await prisma.user.findUnique({
          where: { id: BigInt(userId as string) },
          include: { subscriptions: true },
        })
      : null;
    const isSubscriber =
      user && user.subscriptions.some((sub) => sub.status === "ACTIVE");

    const videos = await prisma.content.findMany({
      where: {
        OR: [
          { type: "SHORT" },
          { is_premium: isSubscriber ? undefined : false },
        ],
      },
    });

    res.json(videos);
  } catch (error: unknown) {
    handleError(res, error, "Failed to fetch videos.");
  }
});

app.get(
  "/api/subscriptions/active",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const activeSubscriptions = await prisma.$queryRaw`
      SELECT * FROM active_subscriptions_view
    `;
      res.json(activeSubscriptions);
    } catch (error: unknown) {
      handleError(res, error, "Failed to fetch active subscriptions.");
    }
  }
);

app.get(
  "/api/contents/popular",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const popularContents = await prisma.$queryRaw`
      SELECT * FROM popular_contents_view LIMIT 10
    `;
      res.json(popularContents);
    } catch (error: unknown) {
      handleError(res, error, "Failed to fetch popular contents.");
    }
  }
);

app.get(
  "/api/users/:id/view-stats",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userStats = await prisma.$queryRaw`
      SELECT * FROM user_view_stats_view WHERE user_id = ${BigInt(
        req.params.id
      )}
    `;
      res.json(userStats);
    } catch (error: unknown) {
      handleError(res, error, "Failed to fetch user view stats.");
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
