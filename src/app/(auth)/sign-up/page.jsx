"use client";

import { signIn, signUp } from "@/lib/auth-client";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

const SignUpPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("Data from the Form:", data);

    const { data: resData, error } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    console.log("Sign Up Response:", resData);
    console.log("Sign Up Error:", error);
  };

  // Google Login
  const handleGoogleSignIn = async () => {
    const { data, error } = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    console.log("Google Login Response:", data);
    console.log("Google Login Error:", error);
  };

  // GitHub Login
  const handleGitHubSignIn = async () => {
    const { data, error } = await signIn.social({
      provider: "github",
      callbackURL: "/",
    });

    console.log("GitHub Login Response:", data);
    console.log("GitHub Login Error:", error);
  };

  return (
    <div>
      <h2>This is Sign Up page</h2>

      <Form
        className="flex w-96 flex-col gap-4"
        render={(props) => <form {...props} data-custom="foo" />}
        onSubmit={onSubmit}
      >
        {/* Name */}
        <TextField
          isRequired
          name="name"
          validate={(value) => {
            if (value.length < 3) {
              return "Name must be at least 3 characters";
            }

            return null;
          }}
        >
          <Label>Name</Label>
          <Input placeholder="Your Name" />
          <FieldError />
        </TextField>

        {/* Email */}
        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return "Please enter a valid email address";
            }

            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="Your Email" />
          <FieldError />
        </TextField>

        {/* Password */}
        <TextField
          isRequired
          minLength={8}
          name="password"
          type="password"
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters";
            }

            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter";
            }

            if (!/[0-9]/.test(value)) {
              return "Password must contain at least one number";
            }

            return null;
          }}
        >
          <Label>Password</Label>

          <Input placeholder="Enter your password" />

          <Description>
            Must be at least 8 characters with 1 uppercase and 1 number
          </Description>

          <FieldError />
        </TextField>

        {/* Submit and Reset */}
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>

          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </Form>

      <p>OR</p>

      {/* Google Login */}
      <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>

      <p>OR</p>

      {/* GitHub Login */}
      <Button onClick={handleGitHubSignIn}>Sign in with GitHub</Button>
    </div>
  );
};

export default SignUpPage;
