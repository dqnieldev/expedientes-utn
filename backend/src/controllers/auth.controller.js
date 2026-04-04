 import { registerUser, loginUser } from "../services/auth.service.js";
 import { changePassword } from "../services/auth.service.js";

// Controladores para manejar las solicitudes relacionadas con la autenticación de usuarios

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para manejar el inicio de sesión del usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para manejar el cambio de contraseña del usuario
export const changePasswordController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    

    await changePassword(userId, currentPassword, newPassword);
    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
