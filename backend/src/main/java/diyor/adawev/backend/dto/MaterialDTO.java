package diyor.adawev.backend.dto;

import lombok.*;

/**
 * Material DTO - JSON fayldan o'qish uchun
 * DB entity emas, faqat ma'lumotlarni saqlash uchun
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    private String name;
    private String type;
    private String unit;
    private Boolean isAvailable;
}
