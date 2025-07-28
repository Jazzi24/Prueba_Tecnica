import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Box,
  Stack,
} from '@mui/material';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const role = watch('role');
  const status = watch('status');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/api/users/${id}`);
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              setValue(`${key}.${subKey}`, subValue);
            });
          } else {
            setValue(key, value);
          }
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Error al cargar el usuario');
      }
    };

    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (formData) => {
    try {
      await api.put(`/api/users/${id}`, formData);
      alert('Usuario actualizado correctamente');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar usuario');
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" mt={5}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Editar Usuario
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            {...register('first_name')}
          />

          <TextField
            fullWidth
            label="Apellido"
            margin="normal"
            {...register('last_name')}
          />

          <TextField
            fullWidth
            label="Correo"
            margin="normal"
            {...register('email')}
          />

          <TextField
            fullWidth
            label="Teléfono"
            margin="normal"
            {...register('phone_number')}
          />

          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Dirección
          </Typography>

          <TextField
            fullWidth
            label="Calle"
            margin="normal"
            {...register('address.street')}
          />
          <TextField
            fullWidth
            label="Número"
            margin="normal"
            {...register('address.number')}
          />
          <TextField
            fullWidth
            label="Ciudad"
            margin="normal"
            {...register('address.city')}
          />
          <TextField
            fullWidth
            label="Código Postal"
            margin="normal"
            {...register('address.postalCode')}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={role || ''}
              label="Rol"
              onChange={(e) => setValue('role', e.target.value)}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={status || ''}
              label="Estado"
              onChange={(e) => setValue('status', e.target.value)}
            >
              <MenuItem value="Active">Activo</MenuItem>
              <MenuItem value="Inactive">Inactivo</MenuItem>
            </Select>
          </FormControl>


          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Guardar Cambios
          </Button>
        </form>
      </Paper>
    </Container>
  );
}