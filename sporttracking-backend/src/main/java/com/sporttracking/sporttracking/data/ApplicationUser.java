package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Users")
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationUser {
    @Id
    private String id;
    @Field
    private String email;
    @Field
    private String password;

    public ApplicationUser(final String email, final String password) {
        this.email = email;
        this.password = password;
    }
}
