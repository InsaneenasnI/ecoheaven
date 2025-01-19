import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { auth } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Hesla se neshodují');
            return;
        }

        try {
            const { token } = await auth.register(
                formData.email,
                formData.password,
                formData.username
            );
            login(token);
            navigate('/onboarding');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Chyba při registraci');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Registrace
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
            />

            <TextField
                fullWidth
                label="Uživatelské jméno"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
            />

            <TextField
                fullWidth
                label="Heslo"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                helperText="Minimálně 8 znaků, jedno velké písmeno a číslo"
            />

            <TextField
                fullWidth
                label="Potvrzení hesla"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
            />

            <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
            >
                Registrovat se
            </Button>
        </Box>
    );
};

export default RegisterForm; 