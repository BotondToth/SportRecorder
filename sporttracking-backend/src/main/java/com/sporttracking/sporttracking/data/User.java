package com.sporttracking.sporttracking.data;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Users")
public class User {
    @Id
    private String id;
    @Field
    private final String email;
    @Field
    private final String password;
}
