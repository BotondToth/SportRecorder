package com.sporttracking.sporttracking.data;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Users")
public class User {
    @Id
    private String id;
    private final String email;
    private final String password;

    public User(final UserDTO userDTO) {
        this.email = userDTO.getEmail();
        this.password = userDTO.getPassword();
    }
}
