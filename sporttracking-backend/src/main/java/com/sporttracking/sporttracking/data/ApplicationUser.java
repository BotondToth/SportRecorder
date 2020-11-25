package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Builder
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
}
