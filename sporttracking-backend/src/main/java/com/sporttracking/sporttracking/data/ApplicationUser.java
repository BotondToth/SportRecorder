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
    @Field
    private String fullName;
    @Field
    private String username;
    @Field
    private String sex;
    @Field
    private String weight;
    @Field
    private String height;

    public ApplicationUser(final UserDTO userDto) {
        email = userDto.getEmail();
        password = userDto.getPassword();
        fullName = userDto.getFullName();
        username = userDto.getUsername();
        sex = userDto.getSex();
        weight = userDto.getWeight();
        height = userDto.getHeight();
    }
}
