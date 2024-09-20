export class AccountProfileResponseModel {
    displayName: string | null;
    phoneNumber: string | null;
    email: string | null;
    profileImageUrl: string | null;
    isEmailConfirmed: boolean;
    hasProfileImage: boolean;
    enableEditEmail: boolean;
}
