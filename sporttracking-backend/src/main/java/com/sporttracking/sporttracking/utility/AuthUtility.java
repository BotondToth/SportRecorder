package com.sporttracking.sporttracking.utility;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.filters.JWTAuthorizationFilter;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class AuthUtility {

    @Autowired
    private UserMongoRepository userMongoRepository;

    public ApplicationUser getUserFromHeader(final HttpHeaders headers) {
        final String token = Objects.requireNonNull(headers.get("authorization")).get(0);
        return userMongoRepository.findByEmail(JWTAuthorizationFilter.getUserFromToken(token));
    }
}
