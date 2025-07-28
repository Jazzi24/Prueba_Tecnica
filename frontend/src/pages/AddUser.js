import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AddressInput from '../components/AddressInput';
import { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    MenuItem,
    Stack,
    Avatar,
    InputLabel,
    FormControl,
    Select,
    Box,
} from '@mui/material';

const AddUser = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    /*const onSubmit = async (data) => {
      try {
        await api.post('/api/users', data);
        alert('Usuario creado con éxito');
        navigate('/dashboard');
      } catch (err) {
        alert('Error al crear usuario');
      }
    };*/
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Agregar datos básicos
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('phoneNumber', data.phoneNumber || '');
            formData.append('role', data.role);
            formData.append('status', data.status);

            // Agregar dirección
            formData.append('address[street]', data.address?.street || '');
            formData.append('address[number]', data.address?.number || '');
            formData.append('address[city]', data.address?.city || '');
            formData.append('address[postalCode]', data.address?.postalCode || '');

            // Agregar imagen
            if (profileImage) {
                formData.append('profilePicture', profileImage);
            }

            // Hacer POST con el header adecuado
            await api.post('/api/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Usuario creado con éxito');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Error al crear usuario');
        }
    };



    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Agregar Usuario
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        margin="normal"
                        {...register('firstName', { required: true })}
                        error={!!errors.firstName}
                        helperText={errors.firstName && 'Nombre requerido'}
                    />

                    <TextField
                        fullWidth
                        label="Apellido"
                        margin="normal"
                        {...register('lastName', { required: true })}
                        error={!!errors.lastName}
                        helperText={errors.lastName && 'Apellido requerido'}
                    />

                    <TextField
                        fullWidth
                        label="Correo"
                        type="email"
                        margin="normal"
                        {...register('email', { required: true })}
                        error={!!errors.email}
                        helperText={errors.email && 'Correo requerido'}
                    />

                    <TextField
                        fullWidth
                        label="Contraseña"
                        type="password"
                        margin="normal"
                        {...register('password', {
                            required: 'La contraseña es obligatoria',
                            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <TextField
                        fullWidth
                        label="Teléfono"
                        margin="normal"
                        {...register('phoneNumber')}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select defaultValue="User" {...register('role')} label="Rol">
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Estado</InputLabel>
                        <Select defaultValue="Active" {...register('status')} label="Estado">
                            <MenuItem value="Active">Activo</MenuItem>
                            <MenuItem value="Inactive">Inactivo</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                        Dirección
                    </Typography>

                    <TextField fullWidth label="Calle" margin="normal" {...register('address.street')} />
                    <TextField fullWidth label="Número" margin="normal" {...register('address.number')} />
                    <TextField fullWidth label="Ciudad" margin="normal" {...register('address.city')} />
                    <TextField
                        fullWidth
                        label="Código Postal"
                        margin="normal"
                        {...register('address.postalCode')}
                    />

                    <AddressInput
                        onSelect={(address) => {
                            setValue('address.street', address.street);
                            setValue('address.number', address.number);
                            setValue('address.city', address.city);
                            setValue('address.postalCode', address.postalCode);
                        }}
                    />

                    <Box mt={3}>
                        <Button variant="contained" component="label">
                            Subir Imagen de Perfil
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setProfileImage(file);
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setPreviewUrl(reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </Button>
                    </Box>

                    {previewUrl && (
                        <Stack alignItems="center" mt={2}>
                            <Avatar src={previewUrl} alt="Vista previa" sx={{ width: 100, height: 100 }} />
                        </Stack>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4 }}
                    >
                        Guardar Usuario
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddUser;
