package com.danielfreitassc.backend.services.parcel;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.parcel.ParcelRequestDto;
import com.danielfreitassc.backend.dtos.parcel.ParcelResponseDto;
import com.danielfreitassc.backend.mappers.parcel.ParcelMapper;
import com.danielfreitassc.backend.models.parcel.ParcelEntity;
import com.danielfreitassc.backend.repositories.parcel.ParcelRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParcelService {
    private final ParcelMapper parcelMapper;  
    private final ParcelRepository parcelRepository;


    public MessageResponseDto create(ParcelRequestDto parcelRequestDto) {
        parcelRepository.save(parcelMapper.toEntity(parcelRequestDto));
        return new MessageResponseDto("Parcela cadastrada com sucesso");
    }

    public Page<ParcelResponseDto> getParcels(Pageable pageable) {
        return parcelRepository.findAll(pageable).map(parcelMapper::toDto);
    }

    public ParcelResponseDto getParcel(UUID id) {
        return parcelMapper.toDto(findParcelOrThrow(id));
    }

    public MessageResponseDto update(UUID id, ParcelRequestDto parcelRequestDto) {
        ParcelEntity parcelEntity = findParcelOrThrow(id);
        
        parcelMapper.toUpdate(parcelRequestDto, parcelEntity);
        parcelRepository.save(parcelEntity);

        return new MessageResponseDto("Parcela atualizada com sucesso");
    }

    public MessageResponseDto delete(UUID id) {
        parcelRepository.delete(findParcelOrThrow(id));
        return new MessageResponseDto("Parcela removida com sucesso");
    }


    private ParcelEntity findParcelOrThrow(UUID id) {
        Optional<ParcelEntity> parcel = parcelRepository.findById(id);
        if(parcel.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Nenhuma parcela encontrada");
        }
        return parcel.get();
    }
}
