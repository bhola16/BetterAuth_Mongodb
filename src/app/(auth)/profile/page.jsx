"use client";

import { FloppyDisk } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    try {
      // Update name
      const { error: profileError } = await authClient.updateUser({
        name,
      });

      if (profileError) {
        console.error("Profile update error:", profileError);
        return;
      }

      // Change password only if a new password is provided
      if (newPassword) {
        if (!currentPassword) {
          console.error("Current password is required.");
          return;
        }

        const { error: passwordError } = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });

        if (passwordError) {
          console.error("Password change error:", passwordError);
          return;
        }
      }

      console.log("Profile updated successfully!");

      // Clear password fields
      e.currentTarget.elements.currentPassword.value = "";
      e.currentTarget.elements.newPassword.value = "";
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
    <Form className="w-full max-w-96" onSubmit={handleSaveChanges}>
      <Fieldset>
        <Fieldset.Legend>Profile Settings</Fieldset.Legend>

        <Description>Update your profile information and password.</Description>

        <FieldGroup>
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
            <Input placeholder="John Doe" />
            <FieldError />
          </TextField>

          {/* Current Password */}
          <TextField name="currentPassword">
            <Label>Current Password</Label>
            <Input type="password" placeholder="Enter current password" />
            <FieldError />
          </TextField>

          {/* New Password */}
          <TextField
            name="newPassword"
            validate={(value) => {
              if (value && value.length < 8) {
                return "Password must be at least 8 characters";
              }

              return null;
            }}
          >
            <Label>New Password</Label>
            <Input type="password" placeholder="Enter new password" />
            <FieldError />
          </TextField>
        </FieldGroup>

        <Fieldset.Actions>
          <Button type="submit">
            <FloppyDisk />
            Save changes
          </Button>

          <Button type="reset" variant="secondary">
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}
