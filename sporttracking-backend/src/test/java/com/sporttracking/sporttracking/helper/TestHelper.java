package com.sporttracking.sporttracking.helper;

import com.sporttracking.sporttracking.data.*;
import com.sporttracking.sporttracking.data.dto.WorkoutDTO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TestHelper {

    public static ApplicationUser getUserWithUserName(final String userName) {
        final ApplicationUser.ApplicationUserBuilder builder = new ApplicationUser.ApplicationUserBuilder();
        return builder
                .setId(userName)
                .setUsername(userName)
                .build();
    }

    public static List<Friend> getMockedFriendsList() {
        return new ArrayList<>() {
            {
                final Friend.FriendBuilder friendBuilder = new Friend.FriendBuilder();
                final ApplicationUser.ApplicationUserBuilder userBuilder = new ApplicationUser.ApplicationUserBuilder();
                add(friendBuilder
                        .setUser(userBuilder
                                .setEmail("test@test.com")
                                .setFullName("Test Elek")
                                .setHeight("190")
                                .setPassword("randomPassword1")
                                .setSex("male")
                                .setUsername("test")
                                .setWeight("80")
                                .build())
                        .setFriend(userBuilder
                                .setEmail("test2@test.com")
                                .setFullName("Test Elek2")
                                .setHeight("190")
                                .setPassword("randomPassword1")
                                .setSex("female")
                                .setUsername("test2")
                                .setWeight("80")
                                .build())
                        .build());
                add(friendBuilder
                        .setUser(userBuilder
                                .setEmail("test@test.com")
                                .setFullName("Test Elek")
                                .setHeight("190")
                                .setPassword("randomPassword1")
                                .setSex("male")
                                .setUsername("test")
                                .setWeight("80")
                                .build())
                        .setFriend(userBuilder
                                .setEmail("test3@test.com")
                                .setFullName("Test Elek3")
                                .setHeight("190")
                                .setPassword("randomPassword3")
                                .setSex("female")
                                .setUsername("test3")
                                .setWeight("80")
                                .build())
                        .build());
            }
        };
    }

    public static List<FriendWithShare> getMockedFriendsWithShare() {
        return new ArrayList<>(){
            {
                final FriendWithShare.FriendWithShareBuilder friendWithShareBuilder = new FriendWithShare.FriendWithShareBuilder();
                final ApplicationUser.ApplicationUserBuilder userBuilder = new ApplicationUser.ApplicationUserBuilder();

                add(friendWithShareBuilder
                        .setIsWorkoutSharedWith(true)
                        .setUser(userBuilder
                                .setEmail("test@test.com")
                                .setFullName("Test Elek")
                                .setHeight("190")
                                .setPassword("randomPassword1")
                                .setSex("male")
                                .setUsername("test")
                                .setWeight("80")
                                .build())
                        .setFriend(userBuilder
                                .setEmail("test2@test.com")
                                .setFullName("Test Elek2")
                                .setHeight("190")
                                .setPassword("randomPassword1")
                                .setSex("female")
                                .setUsername("test2")
                                .setWeight("80")
                                .build())
                        .build());
                add(friendWithShareBuilder
                        .setIsWorkoutSharedWith(true)
                        .setUser(userBuilder
                                .setEmail("test@test.com")
                                .setFullName("Test Elek")
                                .setHeight("190")
                                .setPassword("randomPassword1")
                                .setSex("male")
                                .setUsername("test")
                                .setWeight("80")
                                .build())
                        .setFriend(userBuilder
                                .setEmail("test3@test.com")
                                .setFullName("Test Elek3")
                                .setHeight("190")
                                .setPassword("randomPassword3")
                                .setSex("female")
                                .setUsername("test3")
                                .setWeight("80")
                                .build())
                        .build());
            }
        };
    }

    public static List<Share> getMockedShares() {
        return new ArrayList<>() {
            {
                final Share.ShareBuilder shareBuilder = new Share.ShareBuilder();
                final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
                add(shareBuilder
                        .setUser(getUserWithUserName("user1"))
                        .setFriend(getUserWithUserName("friend1"))
                        .setWorkout(workoutBuilder
                                .setUser(getUserWithUserName("user1"))
                                .build())
                        .build());

                add(shareBuilder
                        .setUser(getUserWithUserName("user1"))
                        .setFriend(getUserWithUserName("friend2"))
                        .setWorkout(workoutBuilder
                                .setUser(getUserWithUserName("user1"))
                                .build())
                        .build());

                add(shareBuilder
                        .setUser(getUserWithUserName("user2"))
                        .setFriend(getUserWithUserName("friend2"))
                        .setWorkout(workoutBuilder
                                .setUser(getUserWithUserName("user2"))
                                .build())
                        .build());

                add(shareBuilder
                        .setUser(getUserWithUserName("user2"))
                        .setFriend(getUserWithUserName("user1"))
                        .setWorkout(workoutBuilder
                                .setUser(getUserWithUserName("user2"))
                                .build())
                        .build());
            }
        };
    }

    public static List<Workout> getMockedWorkouts() {
        return new ArrayList<>() {
            {
                LocalDate localDate = LocalDate.of(2021, 5, 5);
                Date date = new Date(localDate.toEpochDay());
                final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
                add(workoutBuilder
                        .setUser(TestHelper.getUserWithUserName("user1"))
                        .setDate(date)
                        .setType("Running")
                        .build());
                add(workoutBuilder
                        .setUser(TestHelper.getUserWithUserName("user2"))
                        .setDate(new Date(localDate.minusDays(1).toEpochDay()))
                        .setType("Walking")
                        .build());
            }
        };
    }

    public static List<ApplicationUser> getMockedApplicationUsers() {
        return new ArrayList<>() {
            {
                add(getUserWithUserName("user1"));
                add(getUserWithUserName("user2"));
                add(getUserWithUserName("user3"));
                add(getUserWithUserName("user4"));
                add(getUserWithUserName("user5"));
            }
        };
    }

    public static Workout getWorkoutByDTO(final WorkoutDTO workoutDTO) {
        final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
        return workoutBuilder
                .setType(workoutDTO.getType())
                .setDate(workoutDTO.getDate())
                .setCalories(workoutDTO.getCalories())
                .setLocationPoints(workoutDTO.getLocationPoints())
                .setTitle(workoutDTO.getTitle())
                .setDescription(workoutDTO.getDescription())
                .setDuration(workoutDTO.getDuration())
                .setDistance(workoutDTO.getDistance())
                .build();

    }
}
