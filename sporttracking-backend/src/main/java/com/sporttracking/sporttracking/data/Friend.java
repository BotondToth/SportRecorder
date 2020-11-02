package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Friends")
@NoArgsConstructor
@AllArgsConstructor
public class Friend {
    @Id
    private String id;
    @Field
    private String userId;
    @Field
    @DBRef
    private ApplicationUser user;
    @Field
    private String friendId;
    @Field
    @DBRef
    private ApplicationUser friend;

    public Friend(final ApplicationUser user, final ApplicationUser friend) {
        this.userId = user.getId();
        this.user = user;
        this.friend = friend;
        this.friendId = friend.getId();
    }
}
