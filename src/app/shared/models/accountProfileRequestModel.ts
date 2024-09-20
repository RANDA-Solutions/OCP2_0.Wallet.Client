export class AccountProfileRequestModel {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    profileImageUrl: string | null;
    currentPassword: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
    profileImageFile: File | null;
}
