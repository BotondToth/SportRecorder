package com.sporttracking.sporttracking.data;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private String email;
    private String password;
    private String fullName;
    private String sex;
    private String weight;
    private String height;
}
