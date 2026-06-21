package com.ecommerce.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "name is required")
    private String name;
    @Email(message = "enter a valid email")
    @NotBlank(message = "email required")
    private String email;
    @Size(min = 6,message = "password must contain 6 characters")
    @NotBlank(message = "password is required")
    private String password;
}
