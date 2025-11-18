package com.danielfreitassc.backend.controllers.parcel;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.parcel.ParcelRequestDto;
import com.danielfreitassc.backend.dtos.parcel.ParcelResponseDto;
import com.danielfreitassc.backend.services.parcel.ParcelService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/parcels")
public class ParcelController {
    private final ParcelService parcelService;

    @PostMapping
    public MessageResponseDto create(@RequestBody @Valid ParcelRequestDto parcelRequestDto) {
        return parcelService.create(parcelRequestDto);
    }

    @GetMapping
    public Page<ParcelResponseDto> getParcels(Pageable pageable) {
        return parcelService.getParcels(pageable);
    }

    @GetMapping("/{id}")
    public ParcelResponseDto getParcel(@PathVariable UUID id) {
        return parcelService.getParcel(id);
    }

    @PutMapping("/{id}")
    public MessageResponseDto update(@PathVariable UUID id,@RequestBody @Valid ParcelRequestDto parcelRequestDto) {
        return parcelService.update(id, parcelRequestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto delete(@PathVariable UUID id) {
        return parcelService.delete(id);
    }
}
