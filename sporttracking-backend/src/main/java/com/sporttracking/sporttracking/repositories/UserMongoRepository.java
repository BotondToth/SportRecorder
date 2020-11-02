package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.ApplicationUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserMongoRepository extends MongoRepository<ApplicationUser, String> {
  ApplicationUser findByEmail(String email);

  List<ApplicationUser> findByEmailNot(String email);
}

