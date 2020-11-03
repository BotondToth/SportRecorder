package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.ApplicationUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMongoRepository extends MongoRepository<ApplicationUser, String> {
  ApplicationUser findByEmail(String email);

  List<ApplicationUser> findByEmailNot(String email);
}

