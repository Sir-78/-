package com.example.ninggaolv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {
  private String id;
  private String name;
  private String category;
  private Integer viewCount;
  private Double lat;
  private Double lng;
  private String coverUrl;
}
