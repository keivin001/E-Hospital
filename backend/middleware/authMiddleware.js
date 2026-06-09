import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'e-hospital-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isAuthorized = (req, rolesOrPermissions) => {
  if (!req.user) return false;

  const hasRequiredRole = rolesOrPermissions.some((item) => item === req.user.role);
  const hasRequiredPermission = rolesOrPermissions.some((item) => {
    if (!item.startsWith('perm:')) return false;
    const permissionName = item.slice(5);
    return req.user.permissions?.includes(permissionName);
  });

  return hasRequiredRole || hasRequiredPermission;
};

export const authorize = (...rolesOrPermissions) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!isAuthorized(req, rolesOrPermissions)) {
    return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
  }

  next();
};

export const authorizeSelfOr = (selfParams = ['id'], ...rolesOrPermissions) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const params = Array.isArray(selfParams) ? selfParams : [selfParams];
  const isSelf = params.some((param) => req.params[param] && req.user._id.toString() === req.params[param]);

  if (isSelf || isAuthorized(req, rolesOrPermissions)) {
    return next();
  }

  return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
};
