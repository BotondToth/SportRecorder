package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.dto.UserDTO;
import com.sporttracking.sporttracking.exceptions.EmailAddressTakenException;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.Collections.emptyList;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserMongoRepository userMongoRepository;

    @Autowired
    private AuthUtility authUtility;

    @Override
    public ApplicationUser registerUser(final UserDTO userToRegister) throws EmailAddressTakenException {
        final ApplicationUser userByEmail = userMongoRepository.findByEmail(userToRegister.getEmail());
        if (userByEmail != null) {
            throw new EmailAddressTakenException();
        }
        userToRegister.setPassword(bCryptPasswordEncoder.encode(userToRegister.getPassword()));
        final ApplicationUser newUser = ApplicationUser.builder().email(userToRegister.getEmail())
            .password(userToRegister.getPassword())
            .fullName(userToRegister.getFullName())
            .height(userToRegister.getHeight())
            .sex(userToRegister.getSex())
            .weight(userToRegister.getWeight())
            .build();
        return userMongoRepository.save(newUser);
    }

    @Override
    public List<ApplicationUser> getUsers(final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        return userMongoRepository.findByEmailNot(user.getEmail());
    }

    @Override
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
        final ApplicationUser user = userMongoRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(email);
        }
        return new User(user.getEmail(), user.getPassword(), emptyList());
    }
}
