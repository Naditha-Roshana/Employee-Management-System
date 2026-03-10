package jiat.ems_pro.validation;

public class Validator {
    private static final String ADMIN_SECRET = "00@ADMIN";
    private static final String HR_SECRET = "01@HR";
    private static final String MANAGER_SECRET = "01@MG";

    public static boolean validateRoleSecret(Integer roleId, String secret) {
        return switch (roleId) {
            case 1-> ADMIN_SECRET.equals(secret);
            case 2 -> HR_SECRET.equals(secret);
            case 3 -> MANAGER_SECRET.equals(secret);
            default -> false;
        };
    }
}
