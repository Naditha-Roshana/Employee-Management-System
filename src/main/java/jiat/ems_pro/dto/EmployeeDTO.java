package jiat.ems_pro.dto;

import jiat.ems_pro.entity.EmployeeStatus;

import java.io.Serializable;
import java.time.LocalDateTime;

public class EmployeeDTO implements Serializable {
    private int Id;
    private String firstName;
    private String lastName;
    private String nic;
    private String email;
    private String phone;
    private String position;
    private String department;
    private String hireDate;
    private Double salary;
    private LocalDateTime createdAt;
    private  LocalDateTime updatedAt;
    private EmployeeStatus status;

    public EmployeeDTO() {
    }

    public EmployeeDTO(LocalDateTime createdAt, String department, String email, int Id, String firstName, String hireDate, String lastName, String nic, String phone, String position, Double salary, EmployeeStatus status, LocalDateTime updatedAt) {
        this.createdAt = createdAt;
        this.department = department;
        this.email = email;
        this.Id = Id;
        this.firstName = firstName;
        this.hireDate = hireDate;
        this.lastName = lastName;
        this.nic = nic;
        this.phone = phone;
        this.position = position;
        this.salary = salary;
        this.status = status;
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getId() {
        return Id;
    }

    public void setId(int Id) {
        this.Id = Id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getHireDate() {
        return hireDate;
    }

    public void setHireDate(String hireDate) {
        this.hireDate = hireDate;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
    }
}
