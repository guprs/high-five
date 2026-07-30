import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";


const registerSchema = z.object({

  name: z
    .string()
    .min(2, "Name must have at least 2 characters."),

  email: z
    .string()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must have at least 8 characters."),

  familyName: z
    .string()
    .min(2, "Family name must have at least 2 characters."),

});



export async function register(req: Request, res: Response) {


  const parsed = registerSchema.safeParse(req.body);


  if (!parsed.success) {

    return res.status(400).json({

      message: "Please check your input.",

      errors: parsed.error.flatten().fieldErrors,

    });

  }



  const {
    name,
    email,
    password,
    familyName,

  } = parsed.data;



  const existingUser = await prisma.user.findUnique({

    where: {
      email,
    },

  });



  if (existingUser) {

    return res.status(409).json({

      message: "This email is already registered.",

    });

  }



  const passwordHash = await bcrypt.hash(password, 10);



  const family = await prisma.family.create({

    data: {
      name: familyName,
    },

  });



  const user = await prisma.user.create({

    data: {

      name,

      email,

      passwordHash,

      familyId: family.id,


    },

  });



  const token = jwt.sign(

    {
      userId: user.id,
      familyId: family.id,
    },

    process.env.JWT_SECRET as string,

    {
      expiresIn: "7d",
    }

  );



  return res.status(201).json({

    user: {

      id: user.id,

      name: user.name,

      email: user.email,

      createdAt: user.createdAt,


    },

    family: {

      id: family.id,

      name: family.name,

    },

    token,

  });


}







const loginSchema = z.object({

  email: z
    .string()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),

});





export async function login(req: Request, res: Response) {


  const parsed = loginSchema.safeParse(req.body);



  if (!parsed.success) {

    return res.status(400).json({

      message: "Please check your input.",

      errors: parsed.error.flatten().fieldErrors,

    });

  }




  const {
    email,
    password,

  } = parsed.data;




  const user = await prisma.user.findUnique({

    where: {
      email,
    },

    include: {
      family: {
        select: {
          id: true,
          name: true,
        },
      },
    },

  });





  if (!user) {

    return res.status(401).json({

      message: "Invalid email or password.",

    });

  }





  const passwordMatches = await bcrypt.compare(

    password,

    user.passwordHash

  );





  if (!passwordMatches) {

    return res.status(401).json({

      message: "Invalid email or password.",

    });

  }





  const token = jwt.sign(

    {
      userId: user.id,
      familyId: user.familyId,
    },

    process.env.JWT_SECRET as string,

    {
      expiresIn: "7d",
    }

  );





  return res.json({

    user: {

      id: user.id,

      name: user.name,

      email: user.email,

      createdAt: user.createdAt,


    },

    family: user.family,

    token,

  });


}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must have at least 8 characters."),
});

export async function changePassword(req: AuthRequest, res: Response) {
  const parsed = changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Please check your input.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const passwordMatches = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return res.status(401).json({ message: "Current password is incorrect." });
  }

  const samePassword = await bcrypt.compare(
    parsed.data.newPassword,
    user.passwordHash,
  );

  if (samePassword) {
    return res.status(400).json({
      message: "New password must be different from the current password.",
    });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return res.json({ message: "Password changed successfully." });
}
