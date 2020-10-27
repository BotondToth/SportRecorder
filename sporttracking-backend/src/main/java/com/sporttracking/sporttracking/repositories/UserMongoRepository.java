package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.ApplicationUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserMongoRepository extends MongoRepository<ApplicationUser, String> {
  ApplicationUser findByEmail(String email);
}

