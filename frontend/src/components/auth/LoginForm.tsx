import React, { useState, FormEvent } from 'react';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import { auth } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { token } = await auth.login(email, password);
            login(token);
            navigate('/dashboard');
        } catch (err) {
            setError('Nesprávný email nebo heslo');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Přihlášení
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
            />

            <TextField
                fullWidth
                label="Heslo"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
            />

            <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
            >
                Přihlásit se
            </Button>

            <Divider sx={{ my: 2 }}>nebo</Divider>

            <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => auth.googleLogin()}
                sx={{ mb: 1 }}
            >
                Přihlásit se přes Google
            </Button>

            <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => auth.facebookLogin()}
            >
                Přihlásit se přes Facebook
            </Button>
        </Box>
    );
};

export default LoginForm; 