package com.danielfreitassc.backend.models.users;

public enum UserRole {
    ADMIN("Admin");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
