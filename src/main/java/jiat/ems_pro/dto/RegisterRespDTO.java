package jiat.ems_pro.dto;

public class RegisterRespDTO {
    private boolean success;
    private String message;
    private String code;

    public RegisterRespDTO(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public RegisterRespDTO(String code, String message, boolean success) {
        this.code = code;
        this.message = message;
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
