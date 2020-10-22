package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.User;
import com.sporttracking.sporttracking.data.UserDTO;
import com.sporttracking.sporttracking.exceptions.EmailAddressTakenException;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMongoRepository userMongoRepository;

    @Override
    public User registerUser(UserDTO userToRegister) throws EmailAddressTakenException {
        // check if email already exists
        final User userByEmail = userMongoRepository.findByEmail(userToRegister.getEmail());
        if (userByEmail != null) {
            throw new EmailAddressTakenException();
        }
        return userMongoRepository.save(new User(userToRegister));
    }
}
