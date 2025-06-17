import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

async function validatePassword(password: string, hashedPassword: string) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashResetToken = (resizeToken: string) => {
  return crypto.createHash('sha256').update(resizeToken).digest('hex');
};

const validateResetToken = (resetToken: string, hashedResetToken: string) => {
  return hashResetToken(resetToken) === hashedResetToken;
};

export default {
  hashPassword,
  validatePassword,
  generateResetToken,
  hashResetToken,
  validateResetToken,
};
