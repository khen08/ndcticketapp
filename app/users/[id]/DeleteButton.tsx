import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const DeleteButton = ({ userId }: { userId: number }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/users/${userId}`);

      if (response.data.redirectTo) {
        router.push(response.data.redirectTo);

        if (response.data.redirectTo === "/auth/signin") {
          await signOut({ redirect: false });
          router.push(response.data.redirectTo);
          router.refresh();
        }
      } else {
        router.push("/users");
        router.refresh();
      }
    } catch (error) {
      setIsDeleting(false);
      setError("Unknown Error Occured.");
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({ variant: "destructive" })}
          disabled={isDeleting}
        >
          Delete User
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              disabled={isDeleting}
              onClick={deleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-destructive">{error}</p>
    </>
  );
};

export default DeleteButton;
