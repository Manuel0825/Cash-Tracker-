import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import { Button, TextField, Typography, Paper, Grid, Link } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Mutation for email/password login
  const { mutate: loginMutate, isLoading } = useMutation({
    mutationKey: "login",
    mutationFn: async ({ email, password }) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Error logging in:", error);
    },
  });

  // Handler for form submission
  const onSubmit = (data) => {
    loginMutate(data);
  };

  // Google login function
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Bank Login
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
              autoComplete="current-password"
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
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Button
            variant="contained"
            onClick={googleLogin}
            disabled={isLoading}
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            {isLoading ? "Logging in..." : "Login with Google"}
          </Button>
          <Typography variant="body2" style={{ marginTop: '1rem' }}>
            Don't have an account? <Link href="/signup">SignUp</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}