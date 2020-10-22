package com.sporttracking.sporttracking.data;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class UserDTO {
    @Field
    private final String email;
    @Field
    private final String password;
}
