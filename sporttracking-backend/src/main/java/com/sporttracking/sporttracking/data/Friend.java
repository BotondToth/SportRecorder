package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Builder
@Data
@Document(collection = "Friends")
@NoArgsConstructor
@AllArgsConstructor
public class Friend {
    @Id
    private String id;
    @Field
    @DBRef
    private ApplicationUser user;
    @Field
    @DBRef
    private ApplicationUser friend;
}
