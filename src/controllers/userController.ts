// authController.ts
import { Request, Response } from 'express';
import { userLogin } from '../services/user/auth';
import { createUser, getUsers, getUserById, deleteUserById } from '../services/user/user';
import { changePassword, redefinePassword } from '../services/user/password';

export const loginController = async (req: Request, res: Response) => {
  const {email, password} = req.body;  

  try {
    const result = await userLogin({email, password});
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const createUserController = async (req: Request, res: Response) => {
    const userData = req.body;
  
    try {
      const result = await createUser(userData);
      res.status(201).json({ message: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

export const changePasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await changePassword(email);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const redefinePasswordController = async (req: Request, res: Response) => {
    const {password } = req.body;
    const {token} = req.params
  
    try {
      const result = await redefinePassword(token, password);
      res.status(200).json({ message: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  export const getUserController = async (req: Request, res:Response)=>{

    try {

      const users = await getUsers()

      res.status(200).json({users})

      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      
    }


  }

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getUserById(id);

    if (typeof result === 'string') {
      res.status(404).json({ error: result });
    } else {
      res.status(200).json(result);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await deleteUserById(id);

    if (typeof result === 'string') {
      res.status(404).json({ error: result });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};
