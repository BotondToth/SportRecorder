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
    private String sex;
    @Field
    private String weight;
    @Field
    private String height;

    public ApplicationUser(final UserDTO userDto) {
        this.email = userDto.getEmail();
        this.password = userDto.getPassword();
        this.fullName = userDto.getFullName();
        this.sex = userDto.getSex();
        this.weight = userDto.getWeight();
        this.height = userDto.getHeight();
    }
}
