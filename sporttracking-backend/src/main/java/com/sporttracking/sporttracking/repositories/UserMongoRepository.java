package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserMongoRepository extends MongoRepository<User, String> {
  User findByEmail(String email);
}

