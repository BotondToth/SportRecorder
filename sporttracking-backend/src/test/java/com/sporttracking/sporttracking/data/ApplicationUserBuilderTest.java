package com.sporttracking.sporttracking.data;

import com.github.javafaker.Faker;
import com.github.javafaker.service.FakeValuesService;
import com.github.javafaker.service.RandomService;
import org.junit.jupiter.api.Test;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ApplicationUserBuilderTest {

    @Test
    public void testApplicationUserBuilder() {
        final Faker faker = new Faker(new Locale("en-US"));
        final ApplicationUser.ApplicationUserBuilder builder = new ApplicationUser.ApplicationUserBuilder();
        final FakeValuesService fakeValuesService = new FakeValuesService(
                new Locale("en-US"), new RandomService());
        final String email = fakeValuesService.bothify("????##@gmail.com");

        final String userName = faker.funnyName().name();
        final String password = faker.beer().name();
        final String fullName = faker.name().fullName();
        final ApplicationUser user = builder
                .setEmail(email)
                .setUsername(userName)
                .setPassword(password)
                .setFullName(fullName)
                .setHeight("180")
                .setSex("Male")
                .setWeight("80")
                .build();

        assertNotNull(user);
        assertEquals(email, user.getEmail());
        assertEquals(userName, user.getUsername());
        assertEquals(password, user.getPassword());
        assertEquals(fullName, user.getFullName());
        assertEquals("180", user.getHeight());
        assertEquals("Male", user.getSex());
        assertEquals("80", user.getWeight());
    }
}
