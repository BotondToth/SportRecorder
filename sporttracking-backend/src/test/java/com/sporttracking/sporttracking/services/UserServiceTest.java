package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.dto.UserDTO;
import com.sporttracking.sporttracking.exceptions.EmailAddressTakenException;
import com.sporttracking.sporttracking.exceptions.FriendNotFoundException;
import com.sporttracking.sporttracking.exceptions.UsernameAlreadyTakenException;
import com.sporttracking.sporttracking.helper.TestHelper;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserServiceTest {

    @Mock
    private BCryptPasswordEncoder mockBCryptPasswordEncoder;

    @Mock
    private UserMongoRepository mockUserMongoRepository;

    @Mock
    private AuthUtility mockAuthUtility;

    @InjectMocks
    private UserServiceImpl userService;

    private final static List<ApplicationUser> APPLICATION_USERS = TestHelper.getMockedApplicationUsers();

    private final ApplicationUser.ApplicationUserBuilder userBuilder = new ApplicationUser.ApplicationUserBuilder();

    private final ApplicationUser TEST_USER_1 = userBuilder
            .setEmail("test@test.com")
            .setFullName("Test Elek")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("male")
            .setUsername("test")
            .setWeight("80")
            .build();

    private final ApplicationUser TEST_USER_2 = userBuilder
            .setEmail("test2@test.com")
            .setFullName("Test Elek2")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("female")
            .setUsername("test2")
            .setWeight("80")
            .build();


    @BeforeEach
    public void setUpMocks() {
        when(mockAuthUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockUserMongoRepository.findByEmailNot("test@test.com"))
                .thenReturn(APPLICATION_USERS.stream().filter(a -> !"test@test.com".equals(a.getEmail())).collect(Collectors.toList()));
    }

    @Test
    public void testRegisterUser() throws EmailAddressTakenException, UsernameAlreadyTakenException {
        final UserDTO userDTO = new UserDTO();
        userDTO.setEmail("test@test.com");
        userDTO.setPassword("password");
        userDTO.setUsername("testElek");
        userDTO.setHeight("180");
        userDTO.setSex("Female");
        userDTO.setWeight("80");
        userDTO.setFullName("Test Elek");

        final ApplicationUser.ApplicationUserBuilder builder = new ApplicationUser.ApplicationUserBuilder();
        final ApplicationUser appUserToSave = builder
                .setEmail(userDTO.getEmail())
                .setUsername(userDTO.getUsername())
                .setPassword(userDTO.getPassword())
                .setFullName(userDTO.getFullName())
                .setHeight(userDTO.getHeight())
                .setSex(userDTO.getSex())
                .setWeight(userDTO.getWeight())
                .build();


        when(mockUserMongoRepository.save(any())).thenReturn(appUserToSave);

        final ApplicationUser applicationUser = userService.registerUser(userDTO);
        assertNotNull(applicationUser);
        assertEquals("test@test.com", applicationUser.getEmail());
        assertEquals("testElek", applicationUser.getUsername());
        assertEquals("password", applicationUser.getPassword());
        assertEquals("Test Elek", applicationUser.getFullName());
        assertEquals("180", applicationUser.getHeight());
        assertEquals("Female", applicationUser.getSex());
        assertEquals("80", applicationUser.getWeight());
    }

    @Test
    public void testRegisterUserExpectEmailAddressAlreadyTakenException() {
        final UserDTO userDTO = new UserDTO();
        userDTO.setEmail("test@test.com");
        userDTO.setPassword("password");
        userDTO.setUsername("testElek");
        userDTO.setHeight("180");
        userDTO.setSex("Female");
        userDTO.setWeight("80");
        userDTO.setFullName("Test Elek");

        when(mockUserMongoRepository.findByEmail("test@test.com")).thenReturn(new ApplicationUser.ApplicationUserBuilder().build());

        assertThrows(EmailAddressTakenException.class, () -> {
            userService.registerUser(userDTO);
        });
    }

    @Test
    public void testRegisterUserExpectUsernameAlreadyTakenException() {
        final UserDTO userDTO = new UserDTO();
        userDTO.setEmail("test@test.com");
        userDTO.setPassword("password");
        userDTO.setUsername("testElek");
        userDTO.setHeight("180");
        userDTO.setSex("Female");
        userDTO.setWeight("80");
        userDTO.setFullName("Test Elek");

        when(mockUserMongoRepository.findByUsername("testElek")).thenReturn(new ApplicationUser.ApplicationUserBuilder().build());

        assertThrows(UsernameAlreadyTakenException.class, () -> {
            userService.registerUser(userDTO);
        });
    }

    @Test
    public void testGetUsers() {
        final List<ApplicationUser> applicationUsers = userService.getUsers(new HttpHeaders());
        assertNotNull(applicationUsers);
        assertEquals(5, applicationUsers.size()); //todo
    }

    @Test
    public void testGetCurrentUser() {
        final ApplicationUser applicationUser = userService.getCurrentUser(new HttpHeaders());
        assertNotNull(applicationUser);
        assertEquals(TEST_USER_1, applicationUser);
    }

    @Test
    public void testLoadUserByUserName() {
        when(mockUserMongoRepository.findByEmail("test@test.com")).thenReturn(TEST_USER_1);
        when(mockUserMongoRepository.findByUsername("test2")).thenReturn(TEST_USER_2);
        final UserDetails userDetailsByEmail = userService.loadUserByUsername("test@test.com");
        assertNotNull(userDetailsByEmail);
        assertEquals(new User(TEST_USER_1.getEmail(), TEST_USER_1.getPassword(), emptyList()), userDetailsByEmail);

        final UserDetails userDetailsByUsername = userService.loadUserByUsername("test2");
        assertNotNull(userDetailsByUsername);
        assertEquals(new User(TEST_USER_2.getEmail(), TEST_USER_2.getPassword(), emptyList()), userDetailsByUsername);
    }

    @Test
    public void testLoadUserByUserNameExpectUsernameNotFoundException() {
        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername("test@test.com");
        });
    }

}
