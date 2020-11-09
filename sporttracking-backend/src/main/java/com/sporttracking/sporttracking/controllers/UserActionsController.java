package com.sporttracking.sporttracking.controllers;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.UserDTO;
import com.sporttracking.sporttracking.exceptions.EmailAddressTakenException;
import com.sporttracking.sporttracking.services.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserActionsController implements BaseController {
    
    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/register")
    public Object registerUser(@RequestBody final UserDTO userToRegister) {
        try {
            return userService.registerUser(userToRegister);
        } catch (EmailAddressTakenException e) {
            return new ResponseEntity<>("User cannot be registered", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/users")
    public List<ApplicationUser> getUsers(@RequestHeader HttpHeaders headers) {
        return userService.getUsers(headers);
    }

}
