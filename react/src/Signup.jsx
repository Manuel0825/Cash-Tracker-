import { Box, Button, TextField, Typography, Paper, Grid, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for signing up
  const { mutate: signupMutation, isLoading } = useMutation({
    mutationKey: "signup",
    mutationFn: async ({ email, password }) => {
      return await createUserWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () =>  {
      navigate("/login");
    },
  });

  const onSubmit = async (data) => {
    signupMutation(data);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '1rem' }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              autoComplete="username"
              {...register("email", { required: true })}
              error={!!errors.email}
              helperText={errors.email && "This field is required"}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              autoComplete="new-password"
              style={{ marginTop: '1rem' }}
              {...register("password", { required: true })}
              error={!!errors.password}
              helperText={errors.password && "This field is required"}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <Typography variant="body2" style={{ marginTop: '1rem' }}>
            Already have an account? <Link href="/login">Login here</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
