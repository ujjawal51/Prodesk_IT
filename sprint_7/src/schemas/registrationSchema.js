import { z } from 'zod';

export const stepOneSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'Min 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Min 2 characters'),
  dob: z.string().min(1, 'Date of birth is required').refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age >= 18;
  }, 'Must be at least 18 years old'),
});

export const stepTwoSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address (must include @)'),
  password: z.string().min(1, 'Password is required').min(8, 'Min 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const fullSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'Min 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Min 2 characters'),
  dob: z.string().min(1, 'Date of birth is required').refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age >= 18;
  }, 'Must be at least 18 years old'),
  email: z.string().min(1, 'Email is required').email('Invalid email address (must include @)'),
  password: z.string().min(1, 'Password is required').min(8, 'Min 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
