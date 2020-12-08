package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Users")
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

    private ApplicationUser() {
    }

    private ApplicationUser(final ApplicationUserBuilder builder) {
        email = builder.email;
        password = builder.password;
        fullName = builder.fullName;
        username = builder.username;
        sex = builder.sex;
        weight = builder.weight;
        height = builder.height;
    }

    public static class ApplicationUserBuilder {
        private String email;
        private String password;
        private String fullName;
        private String username;
        private String sex;
        private String weight;
        private String height;


        public ApplicationUserBuilder setEmail(final String email) {
            this.email = email;
            return this;
        }

        public ApplicationUserBuilder setPassword(final String password) {
            this.password = password;
            return this;
        }

        public ApplicationUserBuilder setUsername(final String username) {
            this.username = username;
            return this;
        }

        public ApplicationUserBuilder setFullName(final String fullName) {
            this.fullName = fullName;
            return this;
        }

        public ApplicationUserBuilder setSex(final String sex) {
            this.sex = sex;
            return this;
        }

        public ApplicationUserBuilder setWeight(final String weight) {
            this.weight = weight;
            return this;
        }

        public ApplicationUserBuilder setHeight(final String height) {
            this.height = height;
            return this;
        }

        public ApplicationUser build() {
            return new ApplicationUser(this);
        }
    }
}
