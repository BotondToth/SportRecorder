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

    private ApplicationUser() {}

    public static class ApplicationUserBuilder {
        private final ApplicationUser applicationUser;

        public ApplicationUserBuilder() {
            applicationUser = new ApplicationUser();
        }

        public ApplicationUserBuilder setEmail(final String email) {
            applicationUser.setEmail(email);
            return this;
        }

        public ApplicationUserBuilder setPassword(final String password) {
            applicationUser.setPassword(password);
            return this;
        }

        public ApplicationUserBuilder setUsername(final String username) {
            applicationUser.setUsername(username);
            return this;
        }

        public ApplicationUserBuilder setFullName(final String fullName) {
            applicationUser.setFullName(fullName);
            return this;
        }

        public ApplicationUserBuilder setSex(final String sex) {
            applicationUser.setSex(sex);
            return this;
        }

        public ApplicationUserBuilder setWeight(final String weight) {
            applicationUser.setWeight(weight);
            return this;
        }

        public ApplicationUserBuilder setHeight(final String height) {
            applicationUser.setHeight(height);
            return this;
        }

        public ApplicationUser build() {
            return applicationUser;
        }
    }
}
