package jiat.ems_pro.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import jiat.ems_pro.dto.EmployeeDTO;
import jiat.ems_pro.dto.MiniEmpDTO;
import jiat.ems_pro.dto.StatusResponseDTO;
import jiat.ems_pro.entity.Employee;
import jiat.ems_pro.entity.EmployeeStatus;
import jiat.ems_pro.util.HibernateUtil;
import jiat.ems_pro.util.LocalDateTimeAdapter;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.time.LocalDateTime;
import java.util.List;

public class EmployeeService {
    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
            .create();

    public String getAllEmployees() {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session hibernateSession = HibernateUtil
                .getSessionFactory()
                .openSession();

        try {

            List<Employee> employees = hibernateSession
                    .createQuery("FROM Employee", Employee.class)
                    .list();

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Employees Loaded Successfully");
            responseObject.add("data", GSON.toJsonTree(employees));

        } catch (HibernateException e) {

            responseObject.addProperty("status", false);
            responseObject.addProperty("message", e.getMessage());

        } finally {
            hibernateSession.close();
        }

        return GSON.toJson(responseObject);
    }

    public String addEmployee(EmployeeDTO employeeDTO) {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        boolean status = false;
        String message = "";
        if (employeeDTO.getFirstName() == null || employeeDTO.getFirstName().isBlank()) {
            message = "First Name is Required";
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();

            Employee singleEmployee = session.createNamedQuery("Employee.getByEmail", Employee.class)
                    .setParameter("email", employeeDTO.getEmail())
                    .getSingleResultOrNull();
            if (singleEmployee != null) {
                message = "Employee Already Exists";
            } else {
                Employee emp = new Employee();
                emp.setFirstName(employeeDTO.getFirstName());
                emp.setLastName(employeeDTO.getLastName());
                emp.setEmail(employeeDTO.getEmail());
                emp.setPhone(employeeDTO.getPhone());
                emp.setNic(employeeDTO.getNic());
                emp.setDepartment(employeeDTO.getDepartment());
                emp.setPosition(employeeDTO.getPosition());
                emp.setHireDate(employeeDTO.getHireDate());
                emp.setSalary(employeeDTO.getSalary());
                emp.setStatus(employeeDTO.getStatus());
                Transaction transaction = session.beginTransaction();
                try {
                    session.persist(emp);
                    transaction.commit();
                    status = true;
                    message = "Employee Added Successfully";
                } catch (HibernateException e) {
                    transaction.rollback();
                    message = "Employee Added Failed \n" + "Try Again";
                }
            }
            session.close();
        }
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return GSON.toJson(responseObject);
    }

    public EmployeeDTO getEmployeeById(Integer id) {
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        try {
            Employee employee = hibernateSession.get(Employee.class, id);
            if (employee == null) {
                return null;
            }

            EmployeeDTO dto = new EmployeeDTO();
            dto.setId(employee.getId());
            dto.setFirstName(employee.getFirstName());
            dto.setLastName(employee.getLastName());
            dto.setNic(employee.getNic());
            dto.setEmail(employee.getEmail());
            dto.setPhone(employee.getPhone());
            dto.setPosition(employee.getPosition());
            dto.setDepartment(employee.getDepartment());
            dto.setHireDate(employee.getHireDate());
            dto.setSalary(employee.getSalary());
            dto.setStatus(employee.getStatus());

            return dto;

        } finally {
            hibernateSession.close();
        }
    }

    public String loadEmployeesForSelection() {
        JsonObject responseObject = new JsonObject();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<Employee> employeeList = hibernateSession.createQuery("FROM Employee e", Employee.class).getResultList();
        responseObject.add("data", GSON.toJsonTree(employeeList.stream()
                .map(e -> new MiniEmpDTO(e.getFirstName(), e.getId(), e.getLastName()))
                .toList()));
        hibernateSession.close();
        return GSON.toJson(responseObject);
    }

    public String deleteEmployeeById(Integer id) {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = hibernateSession.beginTransaction();

        try {
            Employee employee = hibernateSession.get(Employee.class, id);
            if (employee == null) {
                responseObject.addProperty("message", "Employee Not Found");
            } else {
                hibernateSession.remove(employee);
                transaction.commit();
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Employee Deleted Successfully");
            }
        } catch (HibernateException e) {
            transaction.rollback();
            responseObject.addProperty("message", "Failed to Delete Employee \n Try Again");
        } finally {
            hibernateSession.close();
        }

        return GSON.toJson(responseObject);
    }

    public String updateEmployeeById(EmployeeDTO employeeDTO) {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = hibernateSession.beginTransaction();

        try{
            Employee emp = hibernateSession.get(Employee.class, employeeDTO.getId());
            System.out.println("Update Employee ID: " + employeeDTO.getId());
            if (emp == null) {
                responseObject.addProperty("message", "Employee Not Found");
                return GSON.toJson(responseObject);
            }

            emp.setFirstName(employeeDTO.getFirstName());
            emp.setLastName(employeeDTO.getLastName());
            emp.setNic(employeeDTO.getNic());
            emp.setEmail(employeeDTO.getEmail());
            emp.setPhone(employeeDTO.getPhone());
            emp.setPosition(employeeDTO.getPosition());
            emp.setDepartment(employeeDTO.getDepartment());
            emp.setHireDate(employeeDTO.getHireDate());
            emp.setSalary(employeeDTO.getSalary());
            emp.setStatus(employeeDTO.getStatus());

            hibernateSession.merge(emp);
            transaction.commit();

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Employee Updated Successfully");

        } catch (HibernateException e) {
            transaction.rollback();
            responseObject.addProperty("message", "Updated Employee Failed. Try Again");
        } finally {
            hibernateSession.close();
        }

        return GSON.toJson(responseObject);
    }

    public String updateEmployeeStatus(int id, String status) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();
        try {
            Employee emp = session.get(Employee.class, id);
            if (emp == null) {
                return GSON.toJson(new StatusResponseDTO("Employee not found", false));
            }
            EmployeeStatus newStatus = EmployeeStatus.valueOf(status.toUpperCase());
            emp.setStatus(newStatus);
            session.merge(emp);
            transaction.commit();
            return GSON.toJson(new StatusResponseDTO("Employee status Updated Successfully", true));
        } catch (Exception e) {
            transaction.rollback();
            return  GSON.toJson(new StatusResponseDTO("Faild to update Employee status", false));
        } finally {
          session.close();
        }

    }
}
