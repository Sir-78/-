package com.example.ninggaolv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
  private String id;
  private String routeId;
  private String routeName;
  private String status;
  private Integer rating;
  private Long date;
  private String sourceType;
  private String sourceId;
}
